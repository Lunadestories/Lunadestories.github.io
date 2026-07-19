# Lunadestories.github.io
🌙 LunaVerse Learn Languages. Read Stories. Explore Life.
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Luna Learning Space</title>
    <style>
        /* CSS Reset & Variable */
        :root {
            --primary-color: #6c5ce7;
            --secondary-color: #a29bfe;
            --text-color: #2d3436;
            --bg-color: #f9f9fb;
            --card-bg: #ffffff;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
        }

        /* Header & Navigation */
        header {
            background-color: var(--card-bg);
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .navbar {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 1.5rem;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-color);
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            text-align: center;
            padding: 5rem 2rem;
        }

        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .btn-start {
            background-color: white;
            color: var(--primary-color);
            padding: 0.8rem 2rem;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-start:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        /* Main Content & Features Area */
        main {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 0 2rem;
        }

        .section-title {
            text-align: center;
            margin-bottom: 3rem;
            font-size: 2rem;
        }

        .grid-container {
display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
        }

        /* Feature Cards */
        .card {
            background-color: var(--card-bg);
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.03);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            border: 1px solid rgba(0,0,0,0.05);
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.08);
        }

        .card-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            display: inline-block;
        }

        .card h3 {
            margin-bottom: 0.5rem;
            color: #1e272e;
        }

        .card p {
            font-size: 0.95rem;
            color: #7f8c8d;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 2rem;
            background-color: #1e272e;
            color: white;
            margin-top: 5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .nav-links {
                display: none; /* Sẽ tối ưu menu mobile ở Phần 2 */
            }
            .hero h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>

    <!-- Header & Menu -->
    <header>
        <nav class="navbar">
            <a href="#" class="logo">🌙 LunaSpace</a>
            <ul class="nav-links">
                <li><a href="#">Trang chủ</a></li>
                <li><a href="#">Tiếng Anh</a></li>
                <li><a href="#">Tiếng Trung</a></li>
                <li><a href="#">Tiếng Đức</a></li>
                <li><a href="#">Thư viện</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Trò chơi</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Welcome -->
    <section class="hero">
        <h1>Chào mừng bạn đến với Luna Learning Space</h1>
        <p>Không gian học ngôn ngữ, đọc truyện và giải trí thông minh mỗi ngày.</p>
        <button class="btn-start">Bắt đầu ngay</button>
    </section>

    <!-- Khu vực các tính năng chính -->
    <main>
        <h2 class="section-title">Khám phá các phân khu học tập</h2>
        
        <div class="grid-container">
            <!-- Học Tiếng Anh -->
            <div class="card" onclick="alert('Tính năng Tiếng Anh đang được phát triển ở Phần 3!')">
                <span class="card-icon">🇬🇧</span>
                <h3>Học Tiếng Anh</h3>
                <p>Từ vựng, ngữ pháp và các bài luyện giao tiếp từ cơ bản đến nâng cao.</p>
            </div>

            <!-- Học Tiếng Trung -->
<div class="card" onclick="alert('Tính năng Tiếng Trung đang được phát triển ở Phần 4!')">
                <span class="card-icon">🇨🇳</span>
                <h3>Học Tiếng Trung</h3>
                <p>Luyện nhớ chữ Hán, phát âm Pinyin và các chủ đề giao tiếp hằng ngày.</p>
            </div>

            <!-- Học Tiếng Đức -->
            <div class="card" onclick="alert('Tính năng Tiếng Đức đang được phát triển ở Phần 5!')">
                <span class="card-icon">🇩🇪</span>
                <h3>Học Tiếng Đức</h3>
                <p>Chinh phục ngôn ngữ châu Âu với kho từ vựng và cấu trúc câu cốt lõi.</p>
            </div>

            <!-- Thư viện truyện -->
            <div class="card" onclick="alert('Thư viện truyện đang được phát triển ở Phần 6!')">
                <span class="card-icon">📚</span>
                <h3>Thư viện truyện</h3>
                <p>Đọc truyện song ngữ và truyện ngắn giúp tăng phản xạ ngôn ngữ tự nhiên.</p>
            </div>

            <!-- Blog Luna -->
            <div class="card" onclick="alert('Blog Luna đang được phát triển ở Phần 7!')">
                <span class="card-icon">✍️</span>
                <h3>Blog Luna</h3>
                <p>Nơi chia sẻ kinh nghiệm học tập, mẹo tự học và những câu chuyện truyền cảm hứng.</p>
            </div>

            <!-- Game học tập -->
            <div class="card" onclick="alert('Game học tập đang được phát triển ở Phần 8!')">
                <span class="card-icon">🎮</span>
                <h3>Game học tập</h3>
                <p>Vừa chơi vừa học với các trò chơi lật thẻ, nối từ và trắc nghiệm vui nhộn.</p>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <p>© 2026 Luna Learning Space. Built with ❤️ for GitHub Pages.</p>
    </footer>

</body>
</html>
