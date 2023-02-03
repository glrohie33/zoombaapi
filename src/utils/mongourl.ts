const mongourl: { url: string } = { url: 'mongodb://localhost/zoomba' };
const env = process.env.APP_ENV;
if (env == 'development') {
  mongourl.url = 'mongodb://localhost/test-zoomba';
} else if (env == 'production') {
  mongourl.url = 'mongodb://localhost/live-zoomba';
}

export default mongourl;
