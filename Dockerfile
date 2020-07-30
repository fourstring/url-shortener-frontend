FROM node AS build
COPY . /home/frontend
WORKDIR /home/frontend
RUN npm install --only=prod && npm run-script build --prod

FROM nginx
COPY --from=build /home/frontend/build /usr/share/nginx/html
