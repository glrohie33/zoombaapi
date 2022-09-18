let mongourl: { url: string };
const env = process.env.APP_ENV;
switch (env) {
  case 'development':
    mongourl.url = "mongodb+srv://glorhie33:Oluwadunmininu@33@cluster0.ygqefen.mongodb.net/?retryWrites=true&w=majority";
    break;
  case 'production':
    mongourl.url = '';
    break;
  default:
    mongourl.url = 'mongodb://localhost/zoomba';
    break;
}

export default mongourl;