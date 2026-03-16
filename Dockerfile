FROM node:22-slim AS build

WORKDIR /app

COPY package.json pikku.config.json tsconfig.json ./
RUN npm install

COPY src ./src
COPY bin ./bin
RUN npx pikku all

FROM node:22-slim

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY --from=build /app/.pikku ./.pikku
COPY --from=build /app/bin ./bin
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig.json ./

EXPOSE 4010

CMD ["npx", "tsx", "bin/start.ts"]
