const config = require("./config.json")

module.exports = {
	
	weather: async function(msg, request){
		const text = msg.body.slice(6)
		const apikey = weather_apikey;
		if(text){
			const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&lang=en&units=metric`
			request({
				url: url,
				json: true
}, async function(err, response, body){
	if(!err){
		if(body.cod === 200){
		const unix_timestamp = body.sys.sunrise;
		const date = new Date(unix_timestamp * 1000)
		const hours = date.getHours();
		const minutes = "0" + date.getMinutes();
		const seconds = "0" + date.getSeconds();
		const sunrise = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)} GMT -0`

		const text = `

		Temperature: ${body.main.temp}
		Thermal sensation: ${body.main.feels_like}
		Description: ${body.weather[0].description}
		Humidity: ${body.main.humidity}%
		Minimum temperature: ${body.main.temp_min}
		Minimum temperature: ${body.main.temp_max}
		Sunrise: ${sunrise}
		`

		msg.reply(text)
		} else {
			msg.reply("This City Doesn't Exist ...")
		}
	} else {
		msg.reply("Enter a City Please...")
	}
			})
		}

	}
}
