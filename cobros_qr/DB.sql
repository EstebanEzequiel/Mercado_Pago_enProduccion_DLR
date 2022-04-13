
CREATE TABLE IF NOT EXISTS public.cajas (
    sucursal numeric NOT NULL,
    dominio character varying NOT NULL,
    caja numeric NOT NULL,
    qr character varying,
    id_mp numeric,
    external_id character varying
);


CREATE TABLE IF NOT EXISTS public.cobros (
    external_id serial NOT NULL,
    id_mp numeric,
    sucursal numeric,
    dominio character varying,
    caja numeric,
    devolucion numeric,
    cancelled boolean,
    topic text,
    "time" timestamp without time zone,
    body json,
    pv numeric,
    tipo integer,
    numero numeric
);


CREATE TABLE IF NOT EXISTS public.devoluciones (
    id_cobro numeric NOT NULL,
    id_payments numeric,
    sucursal numeric,
    dominio character varying,
    caja numeric,
    fecha timestamp without time zone,
    body json,
    id_dev serial NOT NULL
);


CREATE TABLE IF NOT EXISTS public.payments (
    id_payments numeric NOT NULL,
    id_order numeric NOT NULL,
    external_id numeric,
    body json,
    monto numeric,
    "time" time without time zone
);


CREATE TABLE IF NOT EXISTS public.sucursales (
    sucursal numeric NOT NULL,
    nombre character varying,
    dominio character varying NOT NULL,
    ciudad character varying,
    provincia character varying,
    latitud numeric,
    longitud numeric,
    id_mp numeric,
    external_id character varying,
    calle character varying,
    numero numeric
);


CREATE INDEX IF NOT EXISTS fki_fk_caja ON public.cajas USING btree (sucursal, dominio);
CREATE INDEX IF NOT EXISTS fki_fk_cobros ON public.cobros USING btree (sucursal, dominio, caja);


DO $$
BEGIN 
    IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='pk_sucursales') THEN
        ALTER TABLE sucursales ADD CONSTRAINT pk_sucursales
            PRIMARY KEY (sucursal, dominio);
    END IF;
    IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='pk_cajas') THEN
        ALTER TABLE cajas ADD CONSTRAINT pk_cajas 
            PRIMARY KEY (sucursal, dominio, caja);
    END IF;
    IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='pk_cobros') THEN
        ALTER TABLE cobros ADD CONSTRAINT pk_cobros 
            PRIMARY KEY (external_id);
    END IF;
    IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='pk_devoluciones') THEN
        ALTER TABLE devoluciones ADD CONSTRAINT pk_devoluciones 
            PRIMARY KEY (id_cobro, id_dev);
    END IF;
    IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='pk_payments') THEN
        ALTER TABLE payments ADD CONSTRAINT pk_payments 
            PRIMARY KEY (id_payments);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_cajas') THEN
        ALTER TABLE cajas ADD CONSTRAINT fk_cajas
            FOREIGN KEY (sucursal, dominio) REFERENCES public.sucursales(sucursal, dominio) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_cobros') THEN
        ALTER TABLE cobros ADD CONSTRAINT fk_cobros
            FOREIGN KEY (sucursal, dominio, caja) REFERENCES public.cajas(sucursal, dominio, caja) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
    END IF;
     IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_devoluciones_nodo') THEN
        ALTER TABLE devoluciones ADD CONSTRAINT fk_devoluciones_nodo
            FOREIGN KEY (sucursal, caja, dominio) REFERENCES public.cajas(sucursal, caja, dominio) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
    END IF;
    
END;
$$;

ALTER TABLE public.devoluciones ADD COLUMN IF NOT EXISTS monto numeric;
ALTER TABLE public.cobros ADD COLUMN IF NOT EXISTS okcaja numeric;
ALTER TABLE public.cobros ADD COLUMN IF NOT EXISTS monto numeric;
ALTER TABLE public.cobros ADD COLUMN IF NOT EXISTS estado character varying;
ALTER TABLE public.devoluciones ADD COLUMN IF NOT EXISTS estado character varying;
ALTER TABLE public.devoluciones ADD COLUMN IF NOT EXISTS id_mp numeric;
ALTER TABLE cajas DROP CONSTRAINT fk_cajas;
ALTER TABLE cajas ADD CONSTRAINT fk_cajas FOREIGN KEY (sucursal, dominio) REFERENCES public.sucursales(sucursal, dominio) ON UPDATE CASCADE NOT VALID;
ALTER TABLE cobros DROP CONSTRAINT fk_cobros;
ALTER TABLE cobros ADD CONSTRAINT fk_cobros FOREIGN KEY (sucursal, dominio, caja) REFERENCES public.cajas(sucursal, dominio, caja) ON UPDATE CASCADE NOT VALID;
ALTER TABLE devoluciones DROP CONSTRAINT fk_devoluciones_nodo;
ALTER TABLE devoluciones ADD CONSTRAINT fk_devoluciones_nodo FOREIGN KEY (sucursal, caja, dominio) REFERENCES public.cajas(sucursal, caja, dominio) ON UPDATE CASCADE NOT VALID;