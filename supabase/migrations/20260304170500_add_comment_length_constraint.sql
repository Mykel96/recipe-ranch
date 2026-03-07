do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'comments_content_length_1_to_600'
      and conrelid = 'public.comments'::regclass
  ) then
    alter table public.comments
      add constraint comments_content_length_1_to_600
      check (char_length(btrim(content)) between 1 and 600);
  end if;
end
$$;
