export function cutString(s, n){
    let cut= s.indexOf(' ', n);
    if(cut === -1) return s;
    return s.substring(0, cut)
};