dev-up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev up --build -d

dev-down:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

prod-up:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up --build -d

prod-down:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down