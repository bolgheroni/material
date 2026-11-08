// Password gate + static site, as a Cloudflare Worker with static assets.
// The password is NOT in the repo: add SITE_PASSWORD as a secret in
// the Worker > Settings > Variables and Secrets.

const COOKIE = "unibo_auth";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return "";
}

function safeNext(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function loginPage(next, failed) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Unibo AI · sign in</title><style>
:root{--bg:#f5f6f8;--surface:#fff;--ink:#171a24;--muted:#586074;--line:#d9dce6;--accent:#2c4bb8;--bad:#b3362f}
@media (prefers-color-scheme:dark){:root{--bg:#11141b;--surface:#181c26;--ink:#e6e9f1;--muted:#9aa2b7;--line:#2b3142;--accent:#92a7f5;--bad:#f08a80}}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
form{width:min(360px,90vw);padding:28px;background:var(--surface);border:1px solid var(--line);border-radius:14px}
h1{margin:0 0 4px;font-size:1.25rem}p{margin:0 0 18px;color:var(--muted);font-size:.95rem}
input{width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:9px;background:var(--bg);color:var(--ink);font:inherit}
button{width:100%;margin-top:12px;padding:11px;border:0;border-radius:9px;background:var(--accent);color:var(--bg);font:inherit;font-weight:600;cursor:pointer}
.err{margin:10px 0 0;color:var(--bad);font-size:.9rem}
</style></head><body><form method="POST" action="/__login">
<h1>Unibo AI · study material</h1><p>Enter the password to continue.</p>
<input type="hidden" name="next" value="${esc(next)}">
<input type="password" name="password" placeholder="Password" autocomplete="current-password" autofocus required>
${failed ? '<div class="err">Wrong password, try again.</div>' : ""}
<button type="submit">Enter</button></form></body></html>`;
  return new Response(html, {
    status: failed ? 401 : 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

export default {
  async fetch(request, env) {
    if (!env.SITE_PASSWORD) {
      return new Response("SITE_PASSWORD is not configured.", { status: 500 });
    }
    const token = await sha256("unibo-ai-study:" + env.SITE_PASSWORD);
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/__login") {
      const form = await request.formData();
      const given = await sha256("unibo-ai-study:" + String(form.get("password") || ""));
      const target = safeNext(form.get("next"));
      if (given === token) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: target,
            "Set-Cookie": `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
            "Cache-Control": "no-store",
          },
        });
      }
      return loginPage(target, true);
    }

    if (readCookie(request, COOKIE) !== token) {
      return loginPage(url.pathname + url.search, false);
    }

    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
    return out;
  },
};
