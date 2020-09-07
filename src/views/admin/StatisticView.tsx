import React from "react";
import {LastDayStatGraph} from "../../components/admin/LastDayStatGraph";
import {LastWeekStatGraph} from "../../components/admin/LastWeekStatGraph";
import {LastMonthStatGraph} from "../../components/admin/LastMonthStatGraph";
import {LastYearStatGraph} from "../../components/admin/LastYearStatGraph";
import {Grid, useMediaQuery, useTheme} from "@material-ui/core";

export function StatisticView() {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <>
      <Grid container>
        {isWideScreen && <Grid item md={2}/>}
        <Grid item md={8} xs={12}>
          <LastDayStatGraph/>
          <LastWeekStatGraph/>
          <LastMonthStatGraph/>
          <LastYearStatGraph/>
        </Grid>
        {isWideScreen && <Grid item md={2}/>}
      </Grid>
    </>
  )
}
