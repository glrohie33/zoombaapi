const enviroment = process.env.APP_ENV;

let domains = [];
if (enviroment == 'development') {
  domains = [
    'http://seller.dev.zoomba.ng',
    'http://dev.zoomba.ng',
    'http://kampe.dev.zoomba.ng',
  ];
} else if (enviroment == 'production') {
  domains = [
    'https://seller.zoomba.ng',
    'https://zoomba.ng',
    'https://kampe.zoomba.ng',
    'http://seller.zoomba.ng',
    'http://zoomba.ng',
    'http://kampe.zoomba.ng',
    'http://dev.zoomba.ng',
    'https://dev.zoomba.ng',
  ];
} else {
  domains = [
    'http://localhost:4000',
    'http://localhost:5000',
    'http://localhost:5454',
    'http://localhost:8080',
    'http://localhost:8000',
  ];
}

export default domains;
