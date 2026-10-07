const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) => {

    // GET request
    if (req.method === "GET" && req.url.startsWith("/get")) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const name = url.searchParams.get("name");

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<h2>GET Data</h2><p>Hello ${name}</p>`);
    }

    // POST request
    else if (req.method === "POST" && req.url === "/post") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const data = querystring.parse(body);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(
                `<h2>POST Data</h2>
                 <p>Name: ${data.name}</p>
                 <p>Email: ${data.email}</p>`
            );
        });
    }

    // HTML form
    else {
        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <h2>GET Form</h2>

            <form action="/get" method="GET">
                Name:
                <input type="text" name="name">
                <button type="submit">Submit GET</button>
            </form>

            <hr>

            <h2>POST Form</h2>

            <form action="/post" method="POST">
                Name:
                <input type="text" name="name"><br><br>

                Email:
                <input type="email" name="email"><br><br>

                <button type="submit">Submit POST</button>
            </form>
        `);
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});