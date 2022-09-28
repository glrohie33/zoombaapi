const mongourl: { url: string } = { url: 'mongodb://localhost/zoomba-local' };
const env = process.env.APP_ENV;
if (env == 'development') {
  mongourl.url =
    'mongodb://zoomba1:Zoomba123@localhost/test-zoomba?authSource=admin';
} else if (env == 'production') {
  mongourl.url = '';
}

export default mongourl;
