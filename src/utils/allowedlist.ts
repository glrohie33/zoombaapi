const enviroment = process.env.APP_ENV;

let domains = [];
if (enviroment == 'development') {
  domains = ['http://seller.dev.zoomba.ng', 'http://dev.zoomba.ng'];
} else if (enviroment == 'production') {
  domains = ['https://seller.zoomba.ng', 'https://zoomba.ng'];
} else {
  domains = ['http://localhost:4000', 'http://localhost:5000'];
}

export default domains;
