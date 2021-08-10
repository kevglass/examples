const SERVER: string = "discord.com";
const CHANNEL_ID: string = "<YOUR CHANNEL ID HERE>";
const TOKEN: string = "<YOUR BOT TOKEN HERE>"

export class Bot {

  constructor() {
    this.get("channels/" + CHANNEL_ID).then((text: string) => {
        console.log("Discord Bot Connected");
    });
  }

  sendMessage(message: string): void {
    const payload: string = JSON.stringify({
      "content": message
    });

    this.post("channels/" + CHANNEL_ID + "/messages", payload);
  }

  private post(path: string, body: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const options = {
        hostname: SERVER,
        port: 443,
        path: "/api/" + path,
        method: 'POST',
        headers: {
          'Authorization': "Bot " + TOKEN,
          'Content-Type': "application/json",
          'Content-Length': body.length
        }
      }

      const req = makeRequest(options, res => {
        console.log("DISCORD: POST " + path + " Response: " + res.statusCode);
        let chunks: Buffer[] = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          let body = Buffer.concat(chunks);

          resolve(body.toString());
        });
      });

      req.write(body);
      req.end();
    });
  }

  private get(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const options = {
        hostname: SERVER,
        port: 443,
        path: "/api/" + path,
        method: 'GET',
        headers: {
          'Authorization': "Bot " + TOKEN
        }
      }

      const req = makeRequest(options, res => {
        console.log("DISCORD: GET " + path + " Response: " + res.statusCode);
        let chunks: Buffer[] = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          let body = Buffer.concat(chunks);

          resolve(body.toString());
        });
      });
      req.end();
    });
  }
}
