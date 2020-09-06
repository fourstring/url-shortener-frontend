import React from "react";
import {IGeneralStat} from "../../types/IAdminStat";
import {Card, CardContent, CardHeader, Grid, Typography} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import LinkIcon from '@material-ui/icons/Link';
import BarChartIcon from '@material-ui/icons/BarChart';

export function GeneralStatPanel(props: React.PropsWithoutRef<{ data: IGeneralStat }>) {
  const {data} = props;
  return (
    <Card style={{
      margin: 20
    }}>
      <CardHeader
        title={<Typography variant={"h5"}>
          基本数据
        </Typography>}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12} md={4}>
            <Typography variant={"h6"}>
              <PersonIcon/>站点总用户数：{data.users}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant={"h6"}>
              <LinkIcon/>站点总链接数：{data.links}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant={"h6"}>
              <BarChartIcon/>站点人均链接数：{(data.links / data.users).toFixed(0)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
