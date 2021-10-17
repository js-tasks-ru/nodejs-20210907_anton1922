const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

const sendMessage = (message) => {
	if (!message) return;

	subscribers.map(subscriber => {
		subscriber(message);
	});

	subscribers = [];
};

router.get('/subscribe', async (ctx, next) => {
	try {
		const id = ctx.originalUrl.split('=')[1];

		ctx.body = await new Promise(resolve => {
			subscribers.push(resolve);
		});
	} catch(err) {
		console.log('err', err);

		ctx.throw(500);
	}
});

router.post('/publish', async (ctx, next) => {
	try {
		const message = ctx.request.body.message;

		sendMessage(message);

		ctx.body = 'success';
	} catch(err) {
		console.log('err post', err);
		ctx.throw(500);
	}
});

app.use(router.routes());

module.exports = app;
