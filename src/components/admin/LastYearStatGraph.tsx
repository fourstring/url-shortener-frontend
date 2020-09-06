import React from "react";
import {Card, CardContent, CardHeader, Typography} from "@material-ui/core";
import BarChartIcon from "@material-ui/icons/BarChart";

export function LastYearStatGraph() {
  return (
    <Card style={{
      margin: 20
    }}>
      <CardHeader
        title={<Typography variant={"h5"}>
          <BarChartIcon/>
          最近一年内访问量统计
        </Typography>}
      />
      <CardContent>
        <iframe
          src="https://kibana.fourstring.dev/app/visualize#/edit/f6e7af30-effb-11ea-baf7-edd07dbefbbf?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1y,to:now))&_a=(filters:!(),linked:!f,query:(language:kuery,query:''),uiState:(),vis:(aggs:!((enabled:!t,id:'1',params:(customLabel:%E8%AE%BF%E9%97%AE%E9%87%8F,json:''),schema:metric,type:count),(enabled:!t,id:'2',params:(customLabel:%E6%97%B6%E9%97%B4,drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:auto,min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-1d,to:now),useNormalizedEsInterval:!t),schema:segment,type:date_histogram)),params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),grid:(categoryLines:!f),labels:(),legendPosition:right,seriesParams:!((data:(id:'1',label:%E8%AE%BF%E9%97%AE%E9%87%8F),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:area,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),type:area,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:%E8%AE%BF%E9%97%AE%E9%87%8F),type:value))),title:requests_lastday,type:area))"
          height="400" width="100%"></iframe>
      </CardContent>
    </Card>
  )
}
