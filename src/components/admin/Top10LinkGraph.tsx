import React from "react";
import {Card, CardContent, CardHeader, Typography} from "@material-ui/core";

export function Top10LinkGraph() {
  return (
    <Card style={{
      margin: 20
    }}>
      <CardHeader
        title={<Typography variant={"h5"}>
          最热短链接Top10
        </Typography>}
      />
      <CardContent>
        {/*
        // @ts-ignore*/}
        <iframe
          src="https://kibana.fourstring.dev/app/visualize#/edit/16e88f10-ef85-11ea-baf7-edd07dbefbbf?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1y,to:now))&_a=(filters:!(),linked:!f,query:(language:kuery,query:''),uiState:(vis:(colors:('0%20-%2087,500':%23AEA2E0,'175,000%20-%20262,500':%23806EB7,'262,500%20-%20350,000':%23614D93,'87,500%20-%20175,000':%23806EB7),defaultColors:('0%20-%2087,500':'rgb(247,252,245)','175,000%20-%20262,500':'rgb(116,196,118)','262,500%20-%20350,000':'rgb(35,139,69)','87,500%20-%20175,000':'rgb(199,233,192)'))),vis:(aggs:!((enabled:!t,id:'1',params:(customLabel:%E8%AE%BF%E9%97%AE%E9%87%8F),schema:metric,type:count),(enabled:!t,id:'2',params:(customLabel:%E7%9F%AD%E9%93%BE%E6%8E%A5,field:path,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:'1',otherBucket:!f,otherBucketLabel:Other,size:10),schema:segment,type:terms)),params:(addLegend:!t,addTooltip:!t,colorSchema:Greens,colorsNumber:4,colorsRange:!(),enableHover:!f,invertColors:!f,legendPosition:right,percentageMode:!f,setColorRange:!f,times:!(),type:heatmap,valueAxes:!((id:ValueAxis-1,labels:(color:black,overwriteColor:!f,rotate:0,show:!f),scale:(defaultYExtents:!f,type:linear),show:!f,type:value))),title:top10,type:heatmap))"
          height="400" width="100%" loading="lazy">
        </iframe>
      </CardContent>
    </Card>
  )
}
