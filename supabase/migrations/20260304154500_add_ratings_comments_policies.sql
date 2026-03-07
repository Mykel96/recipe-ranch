-- Ratings: enforce one vote per user/recipe and valid score range.
create unique index if not exists ratings_user_recipe_unique_idx
  on public.ratings (user_id, recipe_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ratings_score_between_1_and_5'
      and conrelid = 'public.ratings'::regclass
  ) then
    alter table public.ratings
      add constraint ratings_score_between_1_and_5
      check (score >= 1 and score <= 5);
  end if;
end
$$;

alter table public.comments enable row level security;
alter table public.ratings enable row level security;

drop policy if exists comments_select_published on public.comments;
create policy comments_select_published
  on public.comments
  for select
  using (
    exists (
      select 1
      from public.recipes r
      where r.id = comments.recipe_id
        and r.published = true
    )
  );

drop policy if exists comments_insert_own_author on public.comments;
create policy comments_insert_own_author
  on public.comments
  for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.recipes r
      where r.id = comments.recipe_id
        and r.published = true
    )
  );

drop policy if exists comments_delete_own on public.comments;
create policy comments_delete_own
  on public.comments
  for delete
  to authenticated
  using (author_id = auth.uid());

drop policy if exists ratings_select_published on public.ratings;
create policy ratings_select_published
  on public.ratings
  for select
  using (
    exists (
      select 1
      from public.recipes r
      where r.id = ratings.recipe_id
        and r.published = true
    )
  );

drop policy if exists ratings_insert_own_user on public.ratings;
create policy ratings_insert_own_user
  on public.ratings
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.recipes r
      where r.id = ratings.recipe_id
        and r.published = true
    )
  );

drop policy if exists ratings_update_own_user on public.ratings;
create policy ratings_update_own_user
  on public.ratings
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
