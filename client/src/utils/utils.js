export function getRedirectTo(type, avatar) {
    let path="";
    if(type==='boss') {
      path = '/boss';
    } else {
      path = '/candidate';
    }
    // avatar
    if(!avatar) { // 没有值, 返回信息完善界面的path
      path += 'info';
    }
    return path;
  }