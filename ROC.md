k # Rule of Code

Quy định chung.

---

## I. 🚦 Git Workflow

1. **Tuyệt đối không commit trực tiếp lên:**`main`

    - Luôn tạo nhánh mới để phát triển: `git checkout -b feature/ten-chuc-nang`

2. **Cập nhật nhánh chính trước khi phát triển:**

    ```bash
    git checkout main
    git pull origin main
    git checkout feature/ten-chuc-nang
    git merge main
    ```

3. **Commit message rõ ràng, nhất quán và có ý nghĩa cụ thể.**

    ```
    feat: thêm giao diện giỏ hàng
    fix: sửa lỗi responsive header
    ```

4. **Đẩy code thường xuyên** để tránh xung đột và mất dữ liệu.

5. **Resolve conflict tại local trước khi merge lên main.**

---

## II. 🌿 Branch Naming Convention

| Loại      | Tiền tố     | Ví dụ                    |
| --------- | ----------- | ------------------------ |
| Tính năng | `feature/`  | `feature/login-page`     |
| Sửa lỗi   | `bugfix/`   | `bugfix/fix-cart-update` |
| Refactor  | `refactor/` | `refactor/navbar-ui`     |
| Hotfix    | `hotfix/`   | `hotfix/crash-on-login`  |
| Dev       | `dev/`      | `dev/new-thing`          |

---

## III. ✅ Commit Message Convention

```bash
<type>: mô tả ngắn gọn
```

| Type     | Ý nghĩa                                  |
| -------- | ---------------------------------------- |
| feat     | Thêm tính năng mới                       |
| fix      | Sửa lỗi                                  |
| refactor | Cải tiến code không làm thay đổi hành vi |
| style    | Thay đổi style/format code               |
| chore    | Việc lặt vặt (build, config, deps)       |
| docs     | Thay đổi liên quan tài liệu              |
| test     | Thêm hoặc cập nhật test                  |

---

## IV. 🧱 Clean Code

1. **Tách component nhỏ, mỗi file < 100 dòng nếu có thể.**
2. **Không hard-code**, dùng biến hoặc file config.
3. **Tránh lặp lại logic:** sử dụng hook, utils hoặc component tái sử dụng.
4. **Comment cho đoạn code phức tạp, không cần comment hiển nhiên.**
5. **Xóa code chết và biến không sử dụng.**
6. **Sắp xếp và import gọn gàng theo thứ tự: thư viện, component, style.**

---

## V. 🏷️ Naming Convention

### 1. File & Folder

| Loại      | Quy tắc    | Ví dụ              |
| --------- | ---------- | ------------------ |
| Component | PascalCase | `ProductCard.jsx`  |
| Page      | PascalCase | `HomePage.jsx`     |
| Folder    | kebab-case | `product-list/`    |
| Style     | kebab-case | `product-card.css` |

### 2. Biến, Hàm, Hằng số

| Loại    | Quy tắc            | Ví dụ                       |
| ------- | ------------------ | --------------------------- |
| Biến    | camelCase          | `userList`, `productDetail` |
| Hàm     | camelCase          | `handleClick`, `fetchData`  |
| Hằng số | UPPER_SNAKE_CASE   | `API_URL`, `MAX_RETRY`      |
| Hook    | Bắt đầu bằng `use` | `useAuth()`, `useCart()`    |

---

### 3. Khi dùng Tailwind CSS

-   Sử dụng trực tiếp utility classes trong JSX/HTML.
-   Không cần đặt class riêng nếu không tái sử dụng.

### 4. Sử dụng CSS theo chuẩn BEM

-   Cấu trúc: block\_\_element--modifier

```css
.nav__item--active {
    font-weight: bold;
}
```

---

## VI. 🎨 Tailwind CSS Guidelines

1. Dùng `@apply` cho những class lặp lại nhiều lần trong file CSS module hoặc `global.css`
2. Ưu tiên mobile-first, sử dụng responsive class như `md:`, `lg:`
3. Dùng `max-w`, `min-h`, `overflow-hidden`, `truncate`, `line-clamp` để kiểm soát hiển thị tốt hơn.
4. Tránh viết CSS tay nếu Tailwind có hỗ trợ.

---

> Đây là quy tắc sống của dự án. Nếu có thay đổi, toàn nhóm phải đồng thuận và cập nhật file ROC.md.

## VII. Backend file structure

Thiết kế hệ thống file backend như sau.

```
backend/
├── middelwares/
│   └── error.middleware.js
├── controllers/
│   └── user.controller.js
├── models/
│   └── user.model.js
├── routes/
│   └── user.route.js
├── config/
│   └── db.js
├── app.js
├── .env
├── package.json
```
