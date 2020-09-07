import React, {useState} from "react";
import {adminService} from "../../services/AdminService";
import {createStyles, Grid, Theme} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import {makeStyles} from "@material-ui/core/styles";
import {BaseDataTable} from './BaseDataTable';
import {ILink} from "../../types/ILink";
import {useSearchFilter} from "../../hooks/datatable/useSearchFilter";
import {AddLinkDialog} from "../dialog/AddLinkDialog";
import {useSnackbarFeedback} from "../../hooks/useSnackbarFeedback";
import {IRequestFilterOptions} from "../../services/ServiceInterfaces";

const useStyle = makeStyles((theme: Theme) => createStyles({
  root: {
    width: "100%"
  },
  filter: {
    margin: 10,
  },
  table: {
    width: "100%",
    margin: 20
  }
}));

export function LinkAdminTable() {
  const classes = useStyle();
  const [href, hrefFilter] = useSearchFilter({name: "href", placeholder: "原网址"});
  const [linkKey, linkKeyFilter] = useSearchFilter({name: "linkKey", placeholder: "短链接网址"});
  const [newLinkDialog, setNewLinkDialog] = useState(false);
  const {success, successBar, fail, failBar} = useSnackbarFeedback();
  const tableRef = React.useRef(null);

  function handleNewLinkDialogClose() {
    setNewLinkDialog(false);
    if (tableRef.current) {
      //@ts-ignore
      tableRef.current.onQueryChange();
    }
  }

  const getFilterOptions = () => {
    let options: IRequestFilterOptions<ILink> = {}
    if(linkKey.value) options.search = linkKey.value as string
    if(href.value) options.href = href.value as string
    return options
  }

  return (
    <>
      {successBar}
      {failBar}
      <AddLinkDialog open={newLinkDialog} onClose={handleNewLinkDialogClose}/>
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.filter}>
          {hrefFilter}
        </Grid>
        <Grid item xs={12} className={classes.filter}>
          {linkKeyFilter}
        </Grid>
        <Grid item xs={12} className={classes.table}>
          <BaseDataTable<ILink>
            title={"短链接管理"}
            tableRef={tableRef}
            filterOptions={getFilterOptions()}
            dataSource={adminService}
            columns={[
              {
                title: "短链接网址",
                field: "linkKey"
              },
              {
                title: "原网址",
                field: "href"
              },
              {
                title: "创建用户",
                field: "user.username"
              },
              {
                title: "创建日期",
                field: "createAt"
              },
              {
                title: "最后更新",
                field: "updateAt"
              },
              {
                title: "连接状态",
                field: "disabled",
                lookup: {
                  'false': '正常',
                  'true': '已禁用'
                }
              },
            ]}
            options={
              {
                selection: true,
                actionsColumnIndex: -1
              }
            }
            actions={[
              {
                icon: () => <BlockIcon/>,
                tooltip: '禁用短连接',
                onClick: (event, data) => {
                  if ('href' in data){
                    const doit = async () => {
                      try {
                        await adminService.disable(data.id, true)
                      } catch (e) {
                        fail(e);
                      }
                      if (tableRef.current) {
                        // @ts-ignore
                        tableRef.current.onQueryChange();
                        success();
                      }
                    }
                    doit();
                  }
                },
                position: "row"
              },
              {
                icon: () => <VerifiedUserIcon/>,
                tooltip: '启用短连接',
                onClick: (event, data) => {
                  if ('href' in data){
                    const doit = async () => {
                      try {
                        await adminService.disable(data.id, false)
                      } catch (e) {
                        fail(e);
                      }
                      if (tableRef.current) {
                        // @ts-ignore
                        tableRef.current.onQueryChange();
                        success();
                      }
                    }
                    doit();
                  }
                },
                position: "row"
              },
              {
                icon: () => <DeleteIcon/>,
                tooltip: '删除短连接',
                onClick: (event, data) => {
                  if ('href' in data){
                    const doit = async () => {
                      try {
                        await adminService.delete(data.id)
                      } catch (e) {
                        fail(e);
                      }
                      if (tableRef.current) {
                        // @ts-ignore
                        tableRef.current.onQueryChange();
                        success();
                      }
                    }
                    doit();
                  }
                },
                position: "row"
              },
              {
                icon: () => <AddIcon/>,
                tooltip: '新增短连接',
                isFreeAction: true,
                onClick: () => setNewLinkDialog(true)
              }
            ]}
          />
        </Grid>
      </Grid>
    </>
  )
}