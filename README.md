# iTunes Search

# About project:
	This is a iTunes search app, where I have used apple public api to search the iTunes for software, podcast, viedos and musics etc. I have created a c# api to post and get the button clicks in the local host.

# Front end:
	-Angularjs 1.5
	-Angular Material
	-ChartJs

# Back end:
	- No DB used. I have a static object which acts as a db in this project. (If the project is started or the server went to sleep the static object will be Initialized.)
	- c# Restful api (post, get). Post and get calls to fetch and post the button clicks

# Notes:
	1. No auth used for this project.
	2. The project is also optimised for Mobile view.
	3. There is two tabs in UI. 'Search' is used to search the iTunes and 'Analytics' is used to show the number of clicks made.
	4. Search tab also has filter where you can search by type or by country.
	5. There is 3 links available once the search is completed. Link to artist, link to collection in that album and link to preview. Each link click is captured in the backend.
	6. I have used my own logic for pagination for search results.
	7. Clicks is fetched from the backend in the analytics page and showed in a pie chart. (If the all the clicks are empty, you need to click some links in the UI to view the pie chart).
	8. App is developed in local host, if we host it on iis server or some online cloud. We can capture the clicks by global users.
	9. I have removed the duplicates from iTunes api response based on the collection name.
	10. Sometimes the api response is 403 (Forbidden). Please try again. (Error code: Access to itunes.apple.com was denied).

# Running the project:
	- Open the app solution(.sln) in Visual Studio (Prefered vs pro 2017, because I have developed in 2017).
	- Start the project in VS.
	- Open http://localhost:63978/, if the VS not opens the app automatically.
	- Enjoy searching Itunes and track your analytics.

# Test cases:
	- Input:
		search value - google
		filter - software
	- output - 1 record showed after filtering.

	- Input:
		search value - yelp
		filter - software

	- Input:
		search value - Jack johnson
		filter - none

	- Input:
		search value - love
		filter - none
	- output - Nothing Found. Please Try Again with Correct Name and Filters (Error code 403)

	- Input: (with no internet connection or itunes server issue)
		search value - jack johnson
		filter - none
	- output - Can't Talk to Server. Please Try again after some time and Cross check your internet Connection (Error code 500)
