export function secondsFormatter(sec) {
    const hours = Math.floor(sec / 3600);
    const min = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours} hours, ${min} minutes, and ${seconds} seconds`;
}

export function toSeconds(str) {
    if (!str || str === '0') {
        return 0;
    }
    let list = str.split(", ");
    list[2] = list[2].split(' ')[1];
    list.forEach((ele, i) => {
      list[i] = parseInt(ele.split(' ')[0]);
    });
    return (list[0] * 3600 + list[1] * 60 + list[2]);
}