export function ForbiddenResponse() {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>403 Forbidden</title>
      <style>
        body {
          display: flex;
          height: 100vh;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          background: #f9fafb;
        }
        .box {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        h1 {
          font-size: 3rem;
          color: #dc2626;
          margin-bottom: 1rem;
        }
        p {
          color: #4b5563;
          margin-bottom: 1.5rem;
        }
        a {
          color: white;
          background: #2563eb;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          text-decoration: none;
        }
        a:hover {
          background: #1e40af;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>403</h1>
        <p>You don't have permission to access this page.</p>
        <a href="/">Go Home</a>
      </div>
    </body>
  </html>
  `;
}

