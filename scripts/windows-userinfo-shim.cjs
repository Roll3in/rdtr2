// Some restricted Windows runners fail uv_os_get_passwd before tsx can start.
// Keep this preload isolated to the test command; application code is unaffected.
/* eslint-disable @typescript-eslint/no-require-imports */
const os = require("node:os");

try {
  os.userInfo();
} catch {
  os.userInfo = () => ({
    uid: -1,
    gid: -1,
    username: process.env.USERNAME || "runner",
    homedir: process.env.USERPROFILE || process.cwd(),
    shell: null,
  });
}
