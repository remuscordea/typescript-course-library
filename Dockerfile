FROM node:slim
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 9000
CMD npm run dev
