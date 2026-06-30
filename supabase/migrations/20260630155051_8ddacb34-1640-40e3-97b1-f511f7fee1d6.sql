
CREATE POLICY "Public read homenagens media"
ON storage.objects FOR SELECT
USING (bucket_id = 'homenagens');

CREATE POLICY "Anyone can upload homenagens media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'homenagens');
