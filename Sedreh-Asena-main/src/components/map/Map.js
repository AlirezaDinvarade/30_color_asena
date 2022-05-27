import React, { useState, useEffect } from "react";
import Mapir from "mapir-react-component";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import MapLayout from "../layout/MapLayout";
import "./map.css";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import {utils} from 'react-modern-calendar-datepicker';
import axios from "axios";

const mapIr = Mapir.setToken({
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        "x-api-key":
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ2Mjg2NTBmNGRlNjE3NzMzYjkxNmJhMzdhYTYxNjZiNmU2MDc4ZWM1MmVlZTBkNzNkNWM3OTA5NmY5NjFlZGRhNDgyNjk4MTg1ZjI3OGI5In0.eyJhdWQiOiIxNTM0NCIsImp0aSI6ImQ2Mjg2NTBmNGRlNjE3NzMzYjkxNmJhMzdhYTYxNjZiNmU2MDc4ZWM1MmVlZTBkNzNkNWM3OTA5NmY5NjFlZGRhNDgyNjk4MTg1ZjI3OGI5IiwiaWF0IjoxNjMwNTc5NjczLCJuYmYiOjE2MzA1Nzk2NzMsImV4cCI6MTYzMzI2MTY3Mywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.bWmH1iKtVw6rzpTDzaIrnDT0XotLdDQhOPMHH5L6UJLAMfecYpuzZIpNqY_UxoCMIBhwbaL0kX6LtWBNmG8T1MnXkApYLIdbJr-blld7w85hYLdCb2K0KTmKD72cwtBskeEVNG-ScB4QkLgebvDO__001TjdMZOYR17neAUH5GTS6XkocuHJIQo9C8m2AfDskTGbtG9aygp-Z323O5I2Tb5wa4UhOQYHX6T6bXqgWsLWOgzYMfDjbEdU9jMbg0hOXrtXkAfsojD9UBkJpbI4bRJN0ikm-KLXXC8qRuIXck93Njk3jGJPLO4y6QjDU8aV7ACQck1y2L6Q-ydrg5bDSA", //Mapir api key
        "Mapir-SDK": "reactjs",
      },
    };
  },
});

const search = (params) => {
  return fetch(`https://map.ir/search/v2/`, {
    method: "POST",
    headers: {
      "x-api-key":
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ2Mjg2NTBmNGRlNjE3NzMzYjkxNmJhMzdhYTYxNjZiNmU2MDc4ZWM1MmVlZTBkNzNkNWM3OTA5NmY5NjFlZGRhNDgyNjk4MTg1ZjI3OGI5In0.eyJhdWQiOiIxNTM0NCIsImp0aSI6ImQ2Mjg2NTBmNGRlNjE3NzMzYjkxNmJhMzdhYTYxNjZiNmU2MDc4ZWM1MmVlZTBkNzNkNWM3OTA5NmY5NjFlZGRhNDgyNjk4MTg1ZjI3OGI5IiwiaWF0IjoxNjMwNTc5NjczLCJuYmYiOjE2MzA1Nzk2NzMsImV4cCI6MTYzMzI2MTY3Mywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.bWmH1iKtVw6rzpTDzaIrnDT0XotLdDQhOPMHH5L6UJLAMfecYpuzZIpNqY_UxoCMIBhwbaL0kX6LtWBNmG8T1MnXkApYLIdbJr-blld7w85hYLdCb2K0KTmKD72cwtBskeEVNG-ScB4QkLgebvDO__001TjdMZOYR17neAUH5GTS6XkocuHJIQo9C8m2AfDskTGbtG9aygp-Z323O5I2Tb5wa4UhOQYHX6T6bXqgWsLWOgzYMfDjbEdU9jMbg0hOXrtXkAfsojD9UBkJpbI4bRJN0ikm-KLXXC8qRuIXck93Njk3jGJPLO4y6QjDU8aV7ACQck1y2L6Q-ydrg5bDSA", //Mapir api key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};

const Map = () => {
  const [text, setText] = useState("");

  const [$filter] = useState("province eq تهران");

  const [results, setResults] = useState([]);

  const [marker, setMarker] = useState(null);

  const [center, setCenter] = useState([51.33806228911658, 35.6997848215501]);

  const [multiPol, setMultiPol] = useState([]);

  const [coordinateData, setCoordinateData] = useState([]);

  const [allData, setAllData] = useState([]);

  const [colorAll, setColorAll] = useState([]);

  const [popUpCor, setPopUpCor] = useState([]);

  const [address, setAddress] = useState("");

  const [zoom, setZoom] = useState([11]);

  const [isLoading, setIsLoading] = useState(false);

  const persianToday = utils('fa').getToday();

  useEffect(()=>{
    console.log(persianToday)
  },[])

  useEffect(() => {
    if (text.length > 1) {
      const params = {};
      const options = { text, $filter };
      for (let key in options) {
        if (options[key] !== null && options[key] !== "") {
          params[key] = options[key];
        }
      }
      search(params)
        .then((data) => data.json())
        .then((data) => {
          if (data["odata.count"] > 0) {
            setResults(data.value);
          } else {
            setResults([{ notFound: true }]);
          }
        });
    } else if (text.length === 0) {
      setResults([]);
    }
  }, [text]);
 
useEffect( ()=>{
  axios.post("http://185.226.117.165/api/get_polygons",null,{}).then(({data})=>{

     setMultiPol(data.indicator);
  },[])


   }, []);

  useEffect(() => {
    setIsLoading(true);

    const params = new URLSearchParams();
    params.append('lat', popUpCor[1]);
    params.append('lon', popUpCor[0]);
  
    axios.post(`http://185.226.117.165/api/get_point`,params,{

    }).then(({data})=> {
      console.log(data);
         const array = [
          {
            key: "co",
            value: Math.round(data.indicator.CO),
          },
          {
            key: "no2",
            value: Math.round(data.indicator.NO2),
          },
          {
            key: "o3",
            value: Math.round(data.indicator.O3),
          },
          {
            key: "pm10",
            value: Math.round(data.indicator.PM10),
          },
          {
            key: "pm25",
            value: Math.round(data.indicator.PM2_5),
          },
          {
            key: "so2",
            value: Math.round(data.indicator.SO2),
          },
        ];
        const aqi = Math.round(data.indicator.AQI);
        
        let msg = "";
        if (aqi <= 50) {
          msg = "پاک";
        } else if (aqi <= 100 && aqi > 50) {
          msg = "سالم";
        } else if (aqi <= 150 && aqi > 100) {
          msg = "ناسالم برای گروه های حساس";
        } else if (aqi <= 200 && aqi > 150) {
          msg = "ناسالم";
        } else {
          msg = "بسیار ناسالم";
        }
        setAllData([
          { name: "Group A", value: aqi, message: msg },
          { name: "Group B", value: aqi },
        ]);
        let color = "";
        if (aqi <= 50) {
          color = "#00FF00";
        } else if (aqi <= 100 && aqi > 50) {
          color = "#FFFF00";
        } else if (aqi <= 150 && aqi > 100) {
          color = "#FFA500";
        } else if (aqi <= 200 && aqi > 150) {
          color = "#FF0000";
        } else {
          color = "#800080";
        }
        // console.log(data);
        setColorAll([color, "#f2f7f9"]);
        setCoordinateData(array);
        setIsLoading(false);
    }).catch((err)=>console.log(err,"======== error in post"))
  }, [popUpCor]);

  // const [center, setCenter] = useState([51.42047, 35.729054]);

  const reverseFunction = (map, e) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;
    console.log(lng,"================================= lng");
    console.log(lat,"lat ==============================");
    var url = `https://map.ir/reverse/no?lat=${lat}&lon=${lng}`;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ2Mjg2NTBmNGRlNjE3NzMzYjkxNmJhMzdhYTYxNjZiNmU2MDc4ZWM1MmVlZTBkNzNkNWM3OTA5NmY5NjFlZGRhNDgyNjk4MTg1ZjI3OGI5In0.eyJhdWQiOiIxNTM0NCIsImp0aSI6ImQ2Mjg2NTBmNGRlNjE3NzMzYjkxNmJhMzdhYTYxNjZiNmU2MDc4ZWM1MmVlZTBkNzNkNWM3OTA5NmY5NjFlZGRhNDgyNjk4MTg1ZjI3OGI5IiwiaWF0IjoxNjMwNTc5NjczLCJuYmYiOjE2MzA1Nzk2NzMsImV4cCI6MTYzMzI2MTY3Mywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.bWmH1iKtVw6rzpTDzaIrnDT0XotLdDQhOPMHH5L6UJLAMfecYpuzZIpNqY_UxoCMIBhwbaL0kX6LtWBNmG8T1MnXkApYLIdbJr-blld7w85hYLdCb2K0KTmKD72cwtBskeEVNG-ScB4QkLgebvDO__001TjdMZOYR17neAUH5GTS6XkocuHJIQo9C8m2AfDskTGbtG9aygp-Z323O5I2Tb5wa4UhOQYHX6T6bXqgWsLWOgzYMfDjbEdU9jMbg0hOXrtXkAfsojD9UBkJpbI4bRJN0ikm-KLXXC8qRuIXck93Njk3jGJPLO4y6QjDU8aV7ACQck1y2L6Q-ydrg5bDSA", //Mapir api key,
      },
    })
      .then((response) => response.json())
      .then((data) => setAddress(data.postal_address));
    setPopUpCor([lng, lat]);
    setCenter([lng, lat]);
  };

  const clearSearch = () => {
    setResults([]);
    setText("");
  };

  const color = (value) => {
    if (value <= 50) {
      return <div className="dot green"></div>;
    } else if (value <= 100 && value > 50) {
      return <div className="dot yellow"></div>;
    } else if (value <= 150 && value > 100) {
      return <div className="dot orange"></div>;
    } else if (value <= 200 && value > 150) {
      return <div className="dot red"></div>;
    } else {
      return <div className="dot purple"></div>;
    }
  };

  return (
    <MapLayout>
      <div className="wrapper">
        <Mapir
          className="mapir"
          containerStyle={{}}
          center={center}
          minZoom={[13]}
          zoom={zoom}
          scrollZoom={false}
          hash={true}
          interactive={true}
          Map={mapIr}
          onClick={reverseFunction}
        >
          {multiPol.map((item,index) => (
            <Mapir.GeoJSONLayer
             key={index}
              data={{
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "MultiPolygon",
                      coordinates: item.coordinates,
                    },
                  },
                ],
              }}
              linePaint={{
                "line-widthpublic": 0,
                "line-opacity": 0,

              }}
              fillPaint={{
                "fill-color": item.color,
                "fill-opacity": 0.4,
              }}
            />
            ))}  

          {/* {popUpCor[0] !== undefined ? (
            <Mapir.Popup coordinates={popUpCor} offset={null}>
              {!isLoading && allData[0] !== undefined ? (
                <>
                  <div className="text-center rtl font-weight-bold font">
                    شاخص آلودگی : {allData[0].value}
                  </div>
                  <p className="font text-center">{allData[0].message}</p>
                </>
              ) : (
                <div className="d-flex justify-content-center m-4">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </Mapir.Popup>
          ) : null} */}
        </Mapir>

        <div className="slidebar">
          <div className="mt-4 mx-3">
            <div className="search-box">
              <div className="search-box__item flex-row">
                <input
                  className="form-control search-input shadow"
                  type="text"
                  id="search"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  placeholder="جستجوی موقعیت"
                />
                {results.length > 0 && (
                  <div className="clear-seach" onClick={() => clearSearch()}>
                    <span> &#10006; </span>
                  </div>
                )}
              </div>
              {results.length > 0 && (
                <div className="container search-box__item search-results">
                  {results.map((item) => {
                    if (item.notFound === true) {
                      return (
                        <p className="text-center p-2">نتیجه ای یافت نشد</p>
                      );
                    } else {
                      return (
                        <div
                          onClick={() => {
                            setPopUpCor([
                              item.geom.coordinates[0],
                              item.geom.coordinates[1],
                            ]);
                            setCenter(item.geom.coordinates);
                            clearSearch();
                            setAddress(item.address);
                            setZoom([14]);
                          }}
                          className="search-result-item"
                        >
                          <p className="search-result-item-title">
                            <img src="https://map.ir/css/images/marker-default-white.svg" />
                            {item.title}
                          </p>
                          <p className="search-result-item-address">
                            {item.address}
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
            {address.length > 0 ? (
              <div className="location-box  text-center mt-4 p-1">
                {address}
              </div>
            ) : null}

            {allData.length > 0 ? (
              <div className="slide-card mt-4 mx-2 shadow text-center py-3">
                <div className="col-12 text-center p-2 h5">شاخص آلودگی هوا</div>
                {!isLoading ? (
                  <PieChart width={250} height={150}>
                    <Pie
                      data={allData}
                      cx={80}
                      cy={75}
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {allData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colorAll[index % colorAll.length]}
                        />
                      ))}
                    </Pie>
                    <text
                      className="h2 font-weight-bold"
                      x={80}
                      y={90}
                      dy={8}
                      scaleToFit={true}
                      textAnchor="middle"
                      fill={colorAll[0]}
                    >
                      {allData[0].value}
                    </text>
                    <text
                      x={80}
                      y={120}
                      dy={8}
                      textAnchor="middle"
                      fill={"#000000"}
                    >
                      {allData[0].message}
                    </text>
                  </PieChart>
                ) : (
                  <div className="col-12">
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {coordinateData.length > 0 ? (
              <div className="row slide-card mt-4 mx-2 shadow text-center py-3">
                <div className="col-12 text-center p-2 h5">شاخص آلاینده ها</div>
                {!isLoading ? (
                  coordinateData.map((item, index) => (
                    <div className="col-4 py-2">
                      <div className="row">
                        <div className="col-8 font-weight-bold px-1">
                          {item.key}
                        </div>
                        <div className="col-8 text-muted px-1">
                          {item.value}
                        </div>
                        {color(item.value)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </MapLayout>
  );
};
export default Map;

