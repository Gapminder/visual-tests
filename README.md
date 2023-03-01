# VISUAL TESTS Big picture overview

Visual testing is needed to quickly confirm that a page looks like it should by comparing screenshots taken automatically on that page with reference screenshots previously marked as valid.

1. Visual testing software would start (normally as a daily Github Action here) and access [this google spreadsheet](https://docs.google.com/spreadsheets/d/14HrBvsbbaFTwcf-CDRwKUNGxGxD3v-QyyIH-2xe-66E/edit#gid=165961708), which contains URLs and behaviors we would like to test. 
2. Visual testing software would then visit the URLs and perform the behaviors as specified in the spreadsheet and take screenshots for each test.  
3. Visual testing software would upload these screenshots to the cloud (normally to Percy.io here but also possible to google drive here) where a human can review them and judge if the change was intended or not.  
4. Percy.io would report to slack channels if it detects visual changes. 

[LINK TO DOCUMENTATION](https://docs.google.com/document/d/1YJ01QbxlWXgMpKgiJfG5QstHgHHqxU6EXYd0bXnMq0c/preview)
