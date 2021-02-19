const express = require('express')
const ejs = require('ejs')
const path = require('path')
//const pdf = require('html-pdf')
const puppeteer = require('puppeteer')
const app = express()

const passengers = [
	{
		name: "Josue",
		flightNumber: 9876,
		time: "02h00",
	},
	{
		name: "Jessie",
		flightNumber: 1234,
		time: "05h30",
	},
	{
		name: "Jade",
		flightNumber: 5678,
		time: "03h45",
	},
];

app.get('/pdf', async(request, response) => {

	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto('http://localhost:3000/', {
		waitUntil: 'networkidle0'
	})

	const pdf = await page.pdf({
		printBackground: true,
		format: 'Letter',
		margin: {
			top: "20px",
			bottom: "40px",
			left: "20px",
			right: "20px"
		}
	})

	await browser.close()

	response.contentType("application/pdf")

	return response.send(pdf)

})

app.get('/', (request, response) => {

	const filePath = path.join(__dirname, "print.ejs")
	ejs.renderFile(filePath, { passengers }, (error, html) => {
		if (error) {
			return response.send('Error reading file')
		}

		/*
		const options = {
			height: "11.25in",
			width: "8.5in",
			header: {
				height: "20mm"
			},
			footer: {
				height: "20mm"
			}
		}

		pdf.create(html, options).toFile("report.pdf", (error, data) => {
			if (error) {
				return response.send("Error while generating PDF")
			}

			return response.send("PDF generated successfully!")
		})
		*/

		//Send to browser
		return response.send(html)
	})
})

app.listen(3000)