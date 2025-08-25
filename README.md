# Ronaldo Betting Agent - AI Sports Betting Platform

Một nền tảng cá cược thể thao AI sử dụng blockchain Solana với giao diện trò chuyện thông minh.

## 🌟 Tính năng chính

- **AI Agent Ronaldo**: Trợ lý AI thông minh giúp đặt cược bằng ngôn ngữ tự nhiên
- **Tích hợp Solana**: Kết nối trực tiếp với ví Phantom, nạp/rút SOL
- **Dữ liệu thời gian thực**: Lấy tỷ lệ cược từ The Odds API
- **Giao diện responsive**: Thiết kế đẹp, tương thích mobile
- **Lịch sử cá cược**: Theo dõi tất cả giao dịch cược

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Blockchain**: Solana Web3.js
- **API**: The Odds API (sports betting data)
- **Wallet**: Phantom Wallet integration
- **UI/UX**: Font Awesome icons, CSS Grid/Flexbox

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Phantom Wallet extension
- Kết nối internet

### Chạy ứng dụng
1. Clone repository hoặc tải về source code
2. Mở file `index.html` trong trình duyệt
3. Cài đặt Phantom Wallet nếu chưa có
4. Kết nối ví và bắt đầu sử dụng!

### Cấu hình API (Production)
Để sử dụng dữ liệu thật từ The Odds API:

1. Đăng ký tài khoản tại [The Odds API](https://the-odds-api.com)
2. Lấy API key
3. Thay thế `YOUR_ODDS_API_KEY` trong file `js/odds-api.js`
4. Uncomment các phần code API thật và comment phần mock data

## 📱 Hướng dẫn sử dụng

### Kết nối ví
1. Click "Kết nối ví Solana" ở góc trên phải
2. Cho phép kết nối trong Phantom Wallet
3. Số dư SOL sẽ hiển thị tự động

### Đặt cược với AI
Bạn có thể trò chuyện với Ronaldo AI bằng các cách:

- "Tôi muốn cược Manchester United thắng"
- "Đặt cược 0.1 SOL cho Real Madrid"
- "Cho tôi xem trận đấu hôm nay"
- "Cược 0.05 SOL cho hòa"

### Quản lý tài khoản
- **Nạp tiền**: Chuyển SOL vào tài khoản cá cược
- **Rút tiền**: Rút SOL về ví chính
- **Lịch sử**: Xem tất cả giao dịch cược

## 🏗️ Cấu trúc dự án

```
ronaldo-betting-agent/
├── index.html              # Trang chính
├── css/
│   └── style.css           # Styles chính
├── js/
│   ├── main.js            # Logic ứng dụng chính
│   ├── ai-agent.js        # AI Agent Ronaldo
│   ├── solana-wallet.js   # Tích hợp Solana
│   └── odds-api.js        # API tỷ lệ cược
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## 🔧 Tùy chỉnh

### Thêm giải đấu mới
Trong file `js/odds-api.js`, thêm giải đấu vào object `sports`:

```javascript
this.sports = {
    soccer: 'soccer_epl',
    nba: 'basketball_nba',
    // Thêm giải đấu mới
};
```

### Tùy chỉnh AI responses
Trong file `js/ai-agent.js`, chỉnh sửa object `responses`:

```javascript
this.responses = {
    greeting: [
        "Chào bạn! Tôi là Ronaldo AI Agent...",
        // Thêm response mới
    ]
};
```

## ⚠️ Lưu ý quan trọng

- **Testnet**: Mặc định sử dụng Solana Devnet cho demo
- **Security**: Không bao giờ share private key
- **Responsible Gaming**: Chỉ cược với số tiền có thể chấp nhận mất
- **API Limits**: The Odds API có giới hạn requests

## 🐛 Debug và troubleshooting

### Lỗi kết nối ví
- Đảm bảo Phantom Wallet đã được cài đặt
- Kiểm tra popup blocker
- Refresh trang và thử lại

### Lỗi tải dữ liệu
- Kiểm tra kết nối internet
- Xem console log (F12) để debug
- Đảm bảo API key hợp lệ (nếu dùng production)

### Performance
- Sử dụng cache cho dữ liệu API
- Optimize images và assets
- Minify CSS/JS cho production

## 🔐 Security

- Không lưu private keys trong code
- Validate tất cả input từ user
- Sử dụng HTTPS cho production
- Implement rate limiting

## 🚀 Deployment

Để deploy lên production:

1. **Cấu hình mainnet**:
   ```javascript
   this.connection = new solanaWeb3.Connection(
       'https://api.mainnet-beta.solana.com',
       'confirmed'
   );
   ```

2. **Setup real API**:
   - Thay API key thật
   - Remove mock data
   - Enable real betting logic

3. **Hosting**:
   - Upload files lên web server
   - Configure HTTPS
   - Setup domain

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Liên hệ

- GitHub Issues: Báo bug hoặc feature request
- Email: support@example.com (thay bằng email thật)

---

**Disclaimer**: Đây là dự án demo/educational. Vui lòng tuân thủ luật pháp địa phương về cá cược và chỉ sử dụng với mục đích học tập.
