let backendHost;
const apiVersion = 'api/v1/educator/';

const hostname = window && window.location && window.location.hostname;

if(hostname === 'btu.ac.in') {
    backendHost = 'http://ec2-3-90-8-126.compute-1.amazonaws.com';
} else if(hostname === 'auth.btu.ac.in') {
    backendHost = 'http://ec2-3-90-8-126.compute-1.amazonaws.com';
}else if(hostname === 'btu.ac.in.s3-website.ap-south-1.amazonaws.com/') {
    backendHost = 'http://ec2-3-90-8-126.compute-1.amazonaws.com';
}else if(hostname === 'www.btu.ac.in.s3-website.ap-south-1.amazonaws.com/') {
    backendHost = 'http://ec2-3-90-8-126.compute-1.amazonaws.com';
} else if(/^qa/.test(hostname)) {
    backendHost = `https://api.${hostname}`;
} else {
    backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://ec2-3-90-8-126.compute-1.amazonaws.com';
}

export const BASE_URL = `${backendHost}/${apiVersion}`;
