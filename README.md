# sso-demo

Ứng dụng demo **đăng nhập SSO** với luồng OAuth 2.0 / OpenID Connect (authorization code): Express + `express-session`, đổi code lấy token, verify **ID Token** qua JWKS (RS256). Cấu hình mẫu hướng tới Keycloak; bạn thay URL và client trong `src/config/auth.js` cho đúng IdP thật.

## Yêu cầu

- [Node.js](https://nodejs.org/) **18+** (dùng `fetch` có sẵn)
- IdP hỗ trợ OIDC (ví dụ Keycloak) với client **confidential** và redirect URI khớp cấu hình

## Cài đặt

```bash
npm install
```

## Biến môi trường

Sao chép mẫu và chỉnh giá trị:

```bash
cp .env.example .env
```

| Biến | Mô tả |
|------|--------|
| `PORT` | Cổng HTTP (mặc định `3000`) |
| `SESSION_SECRET` | Chuỗi ký session. **Bắt buộc** khi `NODE_ENV=production` |
| `CLIENT_SECRET` | Client secret từ IdP |
| `NODE_ENV` | `development` hoặc `production` |

File `.env` đã được liệt kê trong `.gitignore` — không commit secret.

## Chạy ứng dụng

```bash
npm run dev
```

Script dùng `nodemon` + `cross-env` để set `NODE_ENV=development` và tự restart khi sửa file.

Mặc định: [http://localhost:3000](http://localhost:3000)

## Cấu trúc thư mục

```
src/
├── app.js                 # Khởi tạo Express, gắn middleware & routes
├── config/auth.js         # Issuer, endpoint OIDC, clientId, redirect URI, scopes
├── lib/jwt.js             # JWKS + verify ID token
├── middleware/
│   ├── session.js         # express-session
│   └── auth.js            # requireAuth (redirect /login)
├── routes/
│   ├── auth.js            # /login, /callback, /logout
│   └── homeRoute.js       # /, /admin (protected)
└── controllers/
    └── homeController.js  # Handler trang chủ & admin
```

## Luồng & route

| Đường dẫn | Mô tả |
|-----------|--------|
| `GET /` | Trang chủ (cần đăng nhập) |
| `GET /login` | Bắt đầu OIDC: redirect tới IdP (`state`, `nonce`) |
| `GET /callback` | IdP redirect về; đổi `code` lấy token; verify `id_token`; ghi session |
| `GET /logout` | Xóa session; redirect end-session IdP (nếu cấu hình) |
| `GET /admin` | Ví dụ kiểm tra role `bank-admin` |

## Cấu hình IdP & Keycloak

1. Trong `src/config/auth.js`, cập nhật `issuer`, các endpoint, `clientId`, `redirectUri`, `scopes` và `postLogoutRedirectUri` cho khớp realm/client của bạn.
2. Trên Keycloak, đăng ký **Valid redirect URIs** trùng `redirectUri` (ví dụ `http://localhost:3000/callback`).
3. **ID Token `aud`**: một số realm Keycloak dùng audience khác `clientId` (ví dụ `account`). Nếu verify JWT báo lỗi audience, chỉnh tùy chọn `audience` trong `src/lib/jwt.js` cho khớp token thật.
4. Production: bật cookie `secure: true` trong `src/middleware/session.js` khi chỉ phục vụ qua HTTPS.

## License

ISC
