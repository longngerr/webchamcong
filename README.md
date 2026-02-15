# Web Chấm Công

Ứng dụng chấm công (vào/ra), hiển thị hệ số lương từ Hạ sĩ đến Đại tướng. Dữ liệu lưu trên **Firebase** (Firestore + Auth).

## Chạy trên Netlify

1. Đẩy repo lên **GitHub**.
2. Vào [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project** → chọn GitHub và repo.
3. Cấu hình build:
   - **Build command:** để trống
   - **Publish directory:** `.` (root)
4. **Deploy**. Site sẽ có dạng `https://tên-site.netlify.app`.

File `netlify.toml` trong repo đã cấu hình sẵn, Netlify sẽ dùng nó.

## Chạy trên GitHub Pages

1. Đẩy repo lên **GitHub**.
2. Vào repo → **Settings** → **Pages**.
3. **Source:** Deploy from a branch.
4. **Branch:** `main` (hoặc `master`), folder **/ (root)**.
5. Save. Site sẽ có dạng `https://username.github.io/ten-repo/`.

File `.nojekyll` (trống) trong repo giúp GitHub Pages không dùng Jekyll, phù hợp static site.

## Cấu hình Firebase

- Sửa **`js/firebase-config.js`** với cấu hình từ [Firebase Console](https://console.firebase.google.com) (Thuộc tính dự án → Ứng dụng web).
- Bật **Authentication** → Email/Password, tạo user admin (email + mật khẩu).
- Tạo **Firestore Database**, deploy **Rules** từ file `firestore.rules`.

Sau khi deploy, mở đúng URL và đăng nhập admin bằng email/mật khẩu đã tạo.

**Firebase Authorized domains:** Vào Firebase Console → **Authentication** → **Settings** → **Authorized domains**. Thêm domain của site (vd: `xxx.netlify.app`, `username.github.io`) để đăng nhập hoạt động.
