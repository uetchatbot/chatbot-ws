# API for UETChatbot

### Yêu cầu
* VPS cài sẵn MySQL server, NodeJS
* Chứng thư số SSL cho địa chỉ IP của VPS. *Lưu ý: Có thể dùng SSL cho tên miền riêng, và cần trỏ tên miền về địa chỉ IP VPS*
* Facebook Page (nơi đặt trụ sở Chatbot :P)

### Cấu hình phía Facebook
Làm theo các bước như ở [đây](https://developers.facebook.com/docs/messenger-platform/guides/setup)

*Lưu ý: Bước **Setup a Webhook** sẽ được thực hiện sau khi cấu hình và chạy App trên server*

### Cấu hình phía Server
1. Tạo database mới trong MySQL
2. Cấu hình database, webhook token, Facebook Page token trong `.env`
    * **DB_NAME** tên database đã tạo
    * **DB_USER** người dùng được cấp toàn quyền trên database
    * **DB_PASSWORD** mật khẩu người dùng
    * **WEBHOOK_TOKEN** webhook token của bạn (để Facebook xác nhận webhook)
    * **PAGE_ACCESS_TOKEN** page token bạn lấy được ở bước Cấu hình Facebook
3. Chạy `npm run database` để tạo metadata cho database
4. Chạy `npm start` để khởi động App Chatbot

### Cấu hình Webhook
Thực hiện bước *Setup a Webhook* còn dở ở trên
   * **Callback URL** là url tới webhook của bạn
   * **Verify Token** là webhook token bạn đã cấu hình ở Server
   * **Subscription Fields** tích chọn `messages`

### Done! We have a Chatbot!
Giờ bạn đã có thể public Chatbot để mọi người cùng tham gia thả thính!

Chúc may mắn và hi vọng bạn sẽ xây dựng được một Chatbot của riêng trường mình^^!

*Lưu ý: Khi muốn public Chatbot, bạn cần xin phép Facebook để họ review và public Chatbot cho bạn. Lúc đó thì những người khác mới sử dụng Chatbot được. Xem hướng dẫn ở [đây](https://developers.facebook.com/docs/messenger-platform/app-review)*
