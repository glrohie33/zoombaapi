const mongourl: { url: string } = { url: 'mongodb://localhost/zoomba' };
const env = process.env.APP_ENV;
if (env == 'development') {
  mongourl.url =
    'mongodb+srv://glorhie33:Oluwadunmininu@33@cluster0.ygqefen.mongodb.net/?retryWrites=true&w=majority';
} else if (env == 'production') {
  mongourl.url = '';
}

export default mongourl;
