# docker build . -t datasearch/node; docker run -p 3000:3000 datasearch/node

# docker build -t gitlab.sdu.dk:5050/semester-project-e2020/team-06-data-search/template . && docker push gitlab.sdu.dk:5050/semester-project-e2020/team-06-data-search/template

# kubectl delete -f ./pod.yml && kubectl apply -f ./pod.yml

FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production
# If you are building your code for production
# RUN npm ci --only=production

COPY ./dist/* ./dist/

EXPOSE 3000

CMD [ "node", "dist/main.js" ]