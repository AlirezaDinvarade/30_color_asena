from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PolygonValues
from .serializer import GetPolygonSerializer
from .DateTime import DateTime


Date, Time = DateTime()


class GetPoint(APIView):
    def post(self, request):
        try:
            Longtitude = request.data['lon']
            Latitude = request.data['lat']
            if float(Longtitude) > 51.62 or float(Latitude) > 35.83:
                return Response('this point is out of area')
            point = PolygonValues.objects.filter(ALongitude__lt = Longtitude, ALatitude__lt = Latitude).order_by('-ALongitude','-ALatitude')[0]
        except :
            return Response('this point is out of area')
        ser_data = GetPolygonSerializer(point)

        response_json = {
            "Date": Date,
            "Time": Time,
            "indicator": {"CO": ser_data.data['CO'], "O3": ser_data.data['O3'],"NO2": ser_data.data['NO2'], "SO2": ser_data.data['SO2'],"PM10": ser_data.data['PM10'],"PM2_5": ser_data.data['PM2_5'],"AQI": ser_data.data['AQI']}
        }


        return Response(data=response_json,headers={'Access-Control-Allow-Origin': 'http://185.226.117.165', 'Access-Control-Allow-Credentials':True, 'Access-Control-Allow-Methods' : 'OPTIONS', 'Access-Control-Allow-Headers' : ['Origin', 'Content-Type', 'Accept']})


class GetPolygons(APIView):
    def post(self, request):
        all = PolygonValues.objects.all().values()

        final_indicator = []
        colors = ['#01F0FF', '#07F3D2', '#0DF5A4', '#14F875', '#1AFB46','#21FE18', '#35FF01', '#59FF01', '#7DFF01', '#A0FF01', '#C4FF01', '#E8FF01', '#FAF101', '#FBD301', '#FBB601', '#FC9801', '#FC7B01', '#FD5D01', '#FD4B01', '#FE3F01', '#FE3301',' #DF2301', '#FF1C01', '#FF1001',' #FF0501', '#FF0106', '#FF010F', '#FF0117', '#9F000A', '#6F068B']

        for idx, k in enumerate(range(10, 310, 10)):
            indicator = {"color" : None, "coordinates": []}
            indicator["color"] = colors[idx]
            AQIFiltered = list(filter(lambda sub : sub['AQI'] >= k and sub['AQI'] < k+10, all))
            for data in AQIFiltered:
                indicator["coordinates"].append([[[data['ALongitude'], data['ALatitude']], [data['BLongitude'], data['BLatitude']], [data['CLongitude'], data['CLatitude']], [data['DLongitude'], data['DLatitude']], [data['ALongitude'], data['ALatitude']]]])
            final_indicator.append(indicator) 

        response_json = {
            "Date": Date,
            "Time": Time,
            "indicator": final_indicator
        } 

        return Response(data=response_json, headers={'Access-Control-Allow-Origin': 'http://185.226.117.165', 'Access-Control-Allow-Credentials': True, 'Access-Control-Allow-Methods': 'OPTIONS', 'Access-Control-Allow-Headers': ['Origin', 'Content-Type', 'Accept']})


class DeletePolygons(APIView):
    def get(self, request):
        polygons = PolygonValues.objects.all()
        polygons.delete()
        return Response({"success": "all polygons database removed"})



