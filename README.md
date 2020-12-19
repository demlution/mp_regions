# mp_regions

微信小程序国家行政区划数据

由小程序开发者工具的工程文件转制，用于面向小程序的多平台应用兼容。

小程序开发者工具版本号：`1.03.2011120`

## 输出文件

### `mp_regions.json`

```json
{
    "code": "110000",
    "name": "北京市",
    "postcode": "100000",
    "children": [{
        "code": "110100",
        "name": "北京市",
        "postcode": "100000",
        "children": [{
            "code": "110101",
            "name": "东城区",
            "postcode": "100010"
        }]
    }]
}
```

### `mp_regions.min.json`

类似`mp_regions.json`，没有`postcode`。

```json
{
    "code": "110000",
    "name": "北京市",
    "children": [{
        "code": "110100",
        "name": "北京市",
        "children": [{
            "code": "110101",
            "name": "东城区"
        }]
    }]
}
```

### `mp_vant_area.json`

用于`Vant Area`组件的区划数据，也是一般行政区划数据的结构。

```json
{
    "province_list": {
        "110000": "北京市"
    },
    "city_list": {
        "110100": "北京市"
    },
    "county_list": {
        "110101": "东城区"
    }
}
```


### `adcode_to_postcode.json`

行政区域编码`adcode`到邮政编码`postcode`的映射。

```json
{
    "110000": "100000",
    "110100": "100000",
    "110101": "100010"
}
```
