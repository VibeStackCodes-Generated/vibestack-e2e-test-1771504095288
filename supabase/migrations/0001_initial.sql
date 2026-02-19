CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS "recipes" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "instructions" TEXT NOT NULL,
  "prep_time_minutes" INTEGER,
  "cook_time_minutes" INTEGER,
  "servings" INTEGER,
  "difficulty" TEXT,
  "image_url" TEXT,
  "source_url" TEXT,
  "is_published" BOOLEAN NOT NULL DEFAULT true
);

CREATE TRIGGER trg_recipes_updated_at BEFORE UPDATE ON "recipes" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS "ingredients" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "name" TEXT NOT NULL
);

CREATE TRIGGER trg_ingredients_updated_at BEFORE UPDATE ON "ingredients" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS "tags" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "name" TEXT NOT NULL
);

CREATE TRIGGER trg_tags_updated_at BEFORE UPDATE ON "tags" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS "recipe_ingredients" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "recipe_id" UUID NOT NULL REFERENCES "recipes"("id") ON DELETE CASCADE,
  "ingredient_id" UUID NOT NULL REFERENCES "ingredients"("id") ON DELETE CASCADE,
  "quantity" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_recipe_ingredients_recipe_id ON "recipe_ingredients" ("recipe_id");

CREATE INDEX idx_recipe_ingredients_ingredient_id ON "recipe_ingredients" ("ingredient_id");

CREATE TRIGGER trg_recipe_ingredients_updated_at BEFORE UPDATE ON "recipe_ingredients" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS "recipe_tags" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "recipe_id" UUID NOT NULL REFERENCES "recipes"("id") ON DELETE CASCADE,
  "tag_id" UUID NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE
);

CREATE INDEX idx_recipe_tags_recipe_id ON "recipe_tags" ("recipe_id");

CREATE INDEX idx_recipe_tags_tag_id ON "recipe_tags" ("tag_id");

CREATE TRIGGER trg_recipe_tags_updated_at BEFORE UPDATE ON "recipe_tags" FOR EACH ROW EXECUTE FUNCTION update_updated_at();