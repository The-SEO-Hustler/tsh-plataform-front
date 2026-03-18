export default function seoCheckEmailMessage(url, id, score) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #ffcc00, #ffd633);
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            color: #333;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            background: #ffffff;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .score-box {
            background: #fff;
            border: 3px solid #ffcc00;
            border-radius: 8px;
            padding: 20px;
            margin: 20px;
            text-align: center;
        }
        .score-number {
            font-size: 36px;
            font-weight: bold;
            color: #ffcc00;
            margin: 0;
        }
        .url-box {
            background: #fafafa;
            border-left: 4px solid #ffcc00;
            padding: 15px;
            margin: 20px;
        }
        .cta-button {
            display: inline-block;
            background: #ffcc00;
            color: #333;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px;
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            background: #e6b800;
            transform: translateY(-2px);
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        .timestamp {
            background: #fff;
            padding: 10px;
            border-radius: 5px;
            margin: 15px;
            font-size: 14px;
            color: #666;
            border: 1px solid #eee;
        }
        ul {
            margin: 20px;
            padding-left: 20px;
        }
        li {
            margin: 8px;
            color: #555;
        }
        .useful-links {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .links-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
            margin-top: 10px;
        }
        .link-item {
            color: #ffcc00;
            text-decoration: none;
            font-size: 13px;
            padding: 5px 10px;
            border-radius: 15px;
            background: rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        .link-item:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 SEO Check Completed!</h1>
        </div>
        <div class="content">
            <p>Great news! Your SEO analysis has been completed successfully.</p>
            
            <div class="url-box">
                <strong>Analyzed URL:</strong><br>
                ${url}
            </div>
            
            <div class="score-box">
                <div class="score-number">${score.score}/100</div>
                <p><strong>Overall SEO Score</strong></p>
            </div>
            
            <p>Your comprehensive SEO report is now ready with detailed insights on:</p>
            <ul>
                <li>🔍 Meta tags and title optimization</li>
                <li>📝 Content quality, readability &amp; structure</li>
                <li>🚀 Core Web Vitals (LCP, CLS, FID, TTFB)</li>
                <li>📱 Mobile responsiveness &amp; tap targets</li>
                <li>🔗 Canonical tags &amp; redirect chains</li>
                <li>🌐 Hreflang &amp; multilingual tags</li>
                <li>🛡️ Security headers (HSTS, CSP, X-Frame-Options)</li>
                <li>📊 Structured data &amp; schema validation</li>
                <li>🖼️ Broken images &amp; alt text</li>
                <li>⚡ Technical SEO factors &amp; more...</li>
            </ul>

            ${score.aiRecommendations ? `
            <div style="background: #fffdf0; border: 2px solid #ffcc00; border-radius: 8px; padding: 20px; margin: 20px;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">🤖 AI-Prioritized Recommendations</p>
                <p style="margin: 0; color: #555; font-size: 14px;">Your report includes 10 AI-generated action items ranked by impact &amp; effort — so you know exactly what to fix first.</p>
            </div>` : ''}

            ${score.scoreChange !== undefined ? `
            <div style="background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 15px; margin: 20px; font-size: 14px; color: #555;">
                <strong>📈 vs. Previous Run:</strong>
                ${score.scoreChange > 0 ? `<span style="color: #28a745;">+${score.scoreChange} points improved</span>` : score.scoreChange < 0 ? `<span style="color: #dc3545;">${score.scoreChange} points</span>` : '<span>No change</span>'}
                ${score.improvedChecks?.length ? ` &bull; ${score.improvedChecks.length} check(s) improved` : ''}
                ${score.regressedChecks?.length ? ` &bull; ${score.regressedChecks.length} check(s) regressed` : ''}
            </div>` : ''}
            
            <div style="text-align: center;">
                <a href="https://theseohustler.com/seo-check/result?id=${id}" class="cta-button">
                    📊 View Detailed Results
                </a>
            </div>
            
            <div class="timestamp">
                <strong>Completed:</strong> ${new Date().toLocaleString()}
            </div>
            
            <p>Thank you for using The SEO Hustler! 🚀</p>
            
        </div>
        <div class="footer">
            <p>This email was sent from The SEO Hustler</p>
            <div class="useful-links">
                <p style="margin: 10px 0; font-size: 14px; color: #666;">Useful Links:</p>
                <div class="links-container">
                    <a href="https://theseohustler.com/contact" class="link-item">📞 Contact Us</a>
                    <a href="mailto:contact@theseohustler.com" class="link-item">✉️ Email Us</a>                   <a href="https://theseohustler.com/free-tools" class="link-item">🛠️ Free Tools</a>
                    <a href="https://theseohustler.com/resources" class="link-item">📚 Resources</a>
                    <a href="https://theseohustler.com/blog" class="link-item">📝 Blog</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}