import React, {useContext, useEffect} from "react";
import {Top10LinkGraph} from "../../components/admin/Top10LinkGraph";
import {useRequest} from "../../hooks/useRequest";
import {adminStatService} from "../../services/AdminStatService";
import {IGeneralStat, ITopLink} from "../../types/IAdminStat";
import {CircularProgress, Grid, useMediaQuery, useTheme} from "@material-ui/core";
import {GeneralStatPanel} from "../../components/admin/GeneralStatPanel";
import {FeedbackContext} from "../../contexts/FeedbackContext";

export function AnalysisView() {
  const {data: generalStat, loading: generalStatLoading, error: generalStatError} = useRequest<IGeneralStat>(adminStatService.getGeneral);
  const {data: top10, loading: top10Loading, error: top10Error} = useRequest<ITopLink[]>(adminStatService.getTop10);
  const loading = (generalStatLoading || top10Loading);
  const error = generalStatError || top10Error;
  const normal = !loading && !error;
  const feedback = useContext(FeedbackContext);
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (error) {
      feedback.fail("获取数据失败，请稍后再试！")
    }
  }, [error]);

  return (
    <>
      {
        loading && <CircularProgress/>
      }
      {
        normal && <>
          <Grid container>
            {isWideScreen && <Grid item md={2}/>}
            <Grid item md={8} xs={12}>
              <GeneralStatPanel data={generalStat as IGeneralStat}/>
              <Top10LinkGraph/>
            </Grid>
            {isWideScreen && <Grid item md={2}/>}
          </Grid>
        </>
      }
    </>
  )
}
