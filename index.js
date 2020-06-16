const express = require("express");
const puppeteer = require("puppeteer");
const server = express();
const port = process.env.PORT || 5555;

let track_id;
let output_data = {};

let scraping = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("https://th.kerryexpress.com/th/track/", {
    waitUntil: "networkidle2",
  });
  await page.type("#track1", track_id);
  await Promise.all([
    await page.evaluate(() => {
      document.querySelector('.btn').click()
    }),
    page.waitForNavigation({
      waitUntil: "networkidle2",
    }),
  ]);

  try {
    try {
      const not_found = await page.evaluate(
        () => document.querySelector("div.warpper > h1").innerText
      );
      return "not_found";
    } catch (error) {
      const estimated_date = await page.evaluate(
        () =>
          document.querySelector(
            "div.sector-frame > div > div > div > div > div:nth-child(1) > div.info > div:nth-child(2) > span"
          ).innerText
      );

      const refer = await page.evaluate(
        () =>
          document.querySelector(
            "div.sector-frame > div > div > div > div > div:nth-child(1) > div.info > div:nth-child(3) > span"
          ).innerText
      );

      const sender = await page.evaluate(
        () =>
          document.querySelector(
            "div.sector-frame > div > div > div > div > div:nth-child(1) > div.info > div:nth-child(4) > span"
          ).innerText
      );

      const receiver = await page.evaluate(
        () =>
          document.querySelector(
            "div.sector-frame > div > div > div > div > div:nth-child(1) > div.info > div:nth-child(5) > span"
          ).innerText
      );

      const dateTime = await page.evaluate(() => {
        let data = [];
        let elements = document.getElementsByClassName("date");
        for (let element of elements) {
          element = element.innerText
            .replace("\n", "")
            .replace("Date", "")
            .replace("Time", ",")
            .split(",");
          data.push(element);
        }
        return data;
      });

      const location = await page.evaluate(() => {
        let data = [];
        let elements = document.getElementsByClassName("d2");
        for (let element of elements) {
          element = element.innerText;
          data.push(element);
        }
        return data;
      });

      const description = await page.evaluate(() => {
        let data = [];
        let elements = document.getElementsByClassName("d1");
        for (let element of elements) {
          element = element.innerText.split("\n");
          if (element[1]) {
            this.sign = element[1];
          }
          data.push(element[0]);
        }
        return data;
      });

      const consignee = await page.evaluate(() => {
        let data = document.querySelector(
          "div.sector-frame > div > div > div > div > div.col.colStatus > div.status.piority-success > div.desc > div.d1"
        ).innerText;
        data = data.split("\n");
        data = data[1].replace("ผู้รับสินค้า:", "");
        data = data.trim()
        return data;
      });

      let detail = [];
      output_data["track_id"] = track_id;
      output_data["estimated_date"] = estimated_date;
      output_data["sender"] = sender;
      output_data["receiver"] = receiver;
      output_data["refer"] = refer;
      output_data["consignee"] = consignee;

      for (let i = 0; i < description.length; i++) {
        let data = {};
        data["date"] = dateTime[i][0];
        data["time"] = dateTime[i][1];
        data["description"] = description[i];
        data["location"] = location[i];
        detail.push(data);
      }

      output_data["detail"] = detail;
    }
  } catch (error) {
    return "error";
  }

  await browser.close();
};

server.get("/", (req, res) => {
  track_id = req.query.tracking_number;
  if (track_id === "") {
    res.send(
      {
        status: "Success",
        response: "Tracking Number not found",
      },
      200
    );
  } else if (track_id !== "" && track_id !== undefined) {
    scraping().then((msg) => {
      if (msg === "not_found") {
        res.send(
          {
            status: "Success",
            response: "Tracking Number not found",
          },
          200
        );
      } else if (msg === "error") {
        res.send(
          {
            status: "Success",
            response: "Something Wrong",
          },
          200
        );
      } else {
        res.send(
          {
            status: "Success",
            response: output_data,
          },
          200
        );
      }
    });
  } else {
    res.send(
      {
        status: "Success",
        response:
          "Please go to https://github.com/max180643/kerry-api for API usage.",
      },
      200
    );
  }
});

server.get("*", (req, res) => {
  res.send(
    {
      status: "failure",
      response: "route not found.",
    },
    404
  );
});

server.listen(port, () => console.log("Server running at port %d.", port));
