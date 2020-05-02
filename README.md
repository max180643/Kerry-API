# Kerry API

API for check Kerry tracking status

## Requirements

- Node LTS

## Installation

```sh
$ npm install
$ npm run start
```

or

```sh
$ yarn
$ yarn start
```

## API

This API is based on HTTPS requests and JSON responses. `https://kerry-api.herokuapp.com/`

### Get tracking status

##### API request

`GET /?tracking_number=[:tracking_number]`

##### API response

<details>
<summary>JSON</summary>

```json
{
  "status": "Success",
  "response": {
    "track_id": "SDOF5005500555",
    "estimated_date": "02 พ.ค. 2563",
    "sender": "Demo01",
    "receiver": "Demo02",
    "refer": "",
    "consignee": "Demo02",
    "detail": [
      {
        "date": " 28 เม.ย. 2563",
        "time": " 14:31",
        "description": "ปลายทางได้รับเรียบร้อยแล้ว",
        "location": "ปทุมธานี 2 - ปทุมธานี"
      },
      {
        "date": " 28 เม.ย. 2563",
        "time": " 08:52",
        "description": "กำลังจัดส่ง",
        "location": "ปทุมธานี 2 - ปทุมธานี"
      },
      {
        "date": " 28 เม.ย. 2563",
        "time": " 07:11",
        "description": "พัสดุถึงศูนย์คัดแยก",
        "location": "ปทุมธานี 2 - ปทุมธานี"
      },
      {
        "date": " 28 เม.ย. 2563",
        "time": " 03:32",
        "description": "พัสดุถึงศูนย์คัดแยก",
        "location": "กรุงเทพ2 - กรุงเทพมหานคร"
      },
      {
        "date": " 27 เม.ย. 2563",
        "time": " 17:56",
        "description": "พัสดุถึงศูนย์คัดแยก",
        "location": "- - สมุทรปราการ"
      },
      {
        "date": " 27 เม.ย. 2563",
        "time": " 15:14",
        "description": "เคอรี่เข้ารับพัสดุแล้ว",
        "location": "พาร์เซล ช็อป - Amarin Plaza - กรุงเทพมหานคร"
      },
      {
        "date": " 27 เม.ย. 2563",
        "time": " 13:33",
        "description": "ผู้ส่งมาส่งพัสดุที่จุดส่ง",
        "location": "พาร์เซล ช็อป - Amarin Plaza - กรุงเทพมหานคร"
      }
    ]
  }
}
```

</details>

## Warning

This API crawl data from th.kerryexpress.com/th/track/ and the API cannot handle URL in case of 404 yet
