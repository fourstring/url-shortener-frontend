import React from "react";
import {IGeneralStat} from "../../types/IAdminStat";
import {Card, CardContent, CardHeader, Divider, Grid, Typography, useMediaQuery, useTheme} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import LinkIcon from '@material-ui/icons/Link';
import BarChartIcon from '@material-ui/icons/BarChart';

export function GeneralStatPanel(props: React.PropsWithoutRef<{ data: IGeneralStat }>) {
  const {data} = props;
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Card style={{
      margin: 20
    }}>
      <CardHeader
        title={<Typography variant={"h4"}>
          基本数据
        </Typography>}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12} md={4}>
            <PersonIcon/>
            <Typography variant={"h5"}>
              站点总用户数：{data.users}
            </Typography>
          </Grid>
          {
            isWideScreen && <Divider orientation={"vertical"}/>
          }
          <Grid item xs={12} md={4}>
            <LinkIcon/>
            <Typography variant={"h5"}>
              站点总链接数：{data.links}
            </Typography>
          </Grid>
          {
            isWideScreen && <Divider orientation={"vertical"}/>
          }
          <Grid item xs={12} md={4}>
            <BarChartIcon/>
            <Typography variant={"h5"}>
              站点人均链接数：{(data.links / data.users).toFixed(0)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
