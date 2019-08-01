
Deploying on Windows Server 2016 & IIS 10
========================================================================================
Steps:-
1. Install IIS on Windows Server 2016.
2. Install IISNode on IIS. see  https://github.com/Azure/iisnode
3. Install node js from node site .msi (x64). 
4. Copy express-backend folder on Windows Server e.g. c:\Amiseq_Websites\amiseq-sms-html\express-backend
5. run c:\Amiseq_Websites\amiseq-html-sms\express-backend>npm install
6. Create a site (amiseq-sms) in IIS point to the express-backend folder.
7. open  C:\Windows\System32\drivers\etc\hosts  file in notepad and add the below entry.
127.0.0.1	amiseq-sms
Save and close the file.
8. Copy the index.html & (xyz.bundle.js or xyz.bundle.gz) from react client project\dist folder to ..\express-backend folder on Windows Server.
8. Copy/Create web.config in ..\express-backend (project directory).
9. Handel all the get request (*) in app.js (which is included by start.js).
10. Copy/Create iisnode.yml in ..\express-backend (project directory), to pass env. variable NODE_ENV in app.js.
11. Browse the site http://amiseq-sms it would work. :)
=========================================================================================
