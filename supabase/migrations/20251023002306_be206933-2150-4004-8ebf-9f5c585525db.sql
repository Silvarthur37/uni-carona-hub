-- Corrigir policies de ride_participants que estão causando recursão infinita

-- Remover policies problemáticas
DROP POLICY IF EXISTS "Participantes são visíveis para motorista e passageiros" ON ride_participants;
DROP POLICY IF EXISTS "Motoristas podem atualizar status de participantes" ON ride_participants;
DROP POLICY IF EXISTS "Passageiros podem se inscrever em caronas" ON ride_participants;

-- Recriar policies sem recursão
-- Policy para SELECT: participantes podem ver quando são o passageiro OU quando são o motorista da carona
CREATE POLICY "Participantes podem ver suas solicitações"
ON ride_participants FOR SELECT
USING (
  auth.uid() = passenger_id 
  OR 
  auth.uid() IN (
    SELECT driver_id FROM rides WHERE rides.id = ride_participants.ride_id
  )
);

-- Policy para INSERT: qualquer usuário autenticado pode solicitar participar
CREATE POLICY "Usuários podem solicitar participar de caronas"
ON ride_participants FOR INSERT
WITH CHECK (auth.uid() = passenger_id);

-- Policy para UPDATE: apenas o motorista da carona pode atualizar status
CREATE POLICY "Motoristas podem gerenciar solicitações"
ON ride_participants FOR UPDATE
USING (
  auth.uid() IN (
    SELECT driver_id FROM rides WHERE rides.id = ride_participants.ride_id
  )
);