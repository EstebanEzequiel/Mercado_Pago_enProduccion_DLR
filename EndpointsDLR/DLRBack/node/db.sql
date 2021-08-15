
CREATE TABLE IF NOT EXISTS endpoints(
    endpoint varchar(60) NOT NULL,
    metodo varchar(6) NOT NULL,
    seguridad varchar(1) NOT NULL,
    tabla varchar(30) NOT NULL,
);

CREATE TABLE IF NOT EXISTS propiedades_endpoints(
    endpoint varchar(60) NOT NULL,
    metodo varchar(6) NOT NULL,
    propiedad varchar(15) NOT NULL,
    columna varchar(15) NOT NULL,
    requerido varchar(1) NOT NULL,
    tipo integer NOT NULL

);

DO $$
BEGIN 
    IF NOT EXISTS(select 1 from pg_constraint where conname='pk_endpoints') THEN
        ALTER TABLE endpoints add constraint pk_endpoints
            PRIMARY KEY (endpoint,metodo);
    END IF;
    IF NOT EXISTS(select 1 from pg_constraint where conname='pk_propiedades_endpoints') THEN
        ALTER TABLE propiedades_endpoints add constraint pk_propiedades_endpoints 
            PRIMARY KEY (endpoint,metodo,propiedad);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_propiedades_endpoints') THEN
        ALTER TABLE propiedades_endpoints 
            ADD CONSTRAINT fk_propiedades_endpoints
            FOREIGN KEY (endpoint,metodo) REFERENCES endpoints(endpoint,metodo) ON DELETE CASCADE;
    END IF;
    
    --Los siguientes endpoints y propiedades no pueden definirse a traves de la app
    --Son necesarias para que la dlrendpoints funcione

    --Definicion de endpoints.get
    IF NOT EXISTS(select 1 from endpoints where endpoint='endpoints' and metodo='get') THEN
        INSERT INTO endpoints(endpoint,metodo,seguridad,tabla) VALUES('endpoints','get','N','endpoints');
        --INSERT INTO endpoints(endpoint,metodo,seguridad,tabla) VALUES('animales','get','N','animales_table');
    END IF;
    --Definicion de las propiedades de endpoints.get
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='get' and propiedad='endpoint') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','get','endpoint','endpoint','S',1);
        --INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('animales','get','nombre','columna_nombre','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='get' and propiedad='metodo') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','get','metodo','metodo','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='get' and propiedad='seguridad') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','get','seguridad','seguridad','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='get' and propiedad='tabla') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','get','tabla','tabla','S',1);
    END IF;

    IF NOT EXISTS(select 1 from endpoints where endpoint='endpoints' and metodo='post') THEN
        INSERT INTO endpoints(endpoint,metodo,seguridad,tabla) VALUES('endpoints','post','N','endpoints');
    END IF;
    --Propiedades del post
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='post' and propiedad='endpoint') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','post','endpoint','endpoint','S',1);
        --INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('animales','post','nombre','columna_nombre','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='post' and propiedad='metodo') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','post','metodo','metodo','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='post' and propiedad='seguridad') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','post','seguridad','seguridad','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='post' and propiedad='tabla') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','post','tabla','tabla','S',1);
    END IF;
    IF NOT EXISTS(select 1 from endpoints where endpoint='endpoints' and metodo='put') THEN
        INSERT INTO endpoints(endpoint,metodo,seguridad,tabla) VALUES('endpoints','put','N','endpoints');
    END IF;
    IF NOT EXISTS(select 1 from endpoints where endpoint='endpoints' and metodo='delete') THEN
        INSERT INTO endpoints(endpoint,metodo,seguridad,tabla) VALUES('endpoints','delete','N','endpoints');
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='delete' and propiedad='endpoint') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','delete','endpoint','endpoint','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='delete' and propiedad='metodo') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','delete','metodo','metodo','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='put' and propiedad='endpoint') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','delete','endpoint','endpoint','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='put' and propiedad='metodo') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','delete','endpoint','endpoint','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='put' and propiedad='seguridad') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','delete','endpoint','endpoint','S',1);
    END IF;
    IF NOT EXISTS(select 1 from propiedades_endpoints where endpoint='endpoints' and metodo='put' and propiedad='tabla') THEN
        INSERT INTO propiedades_endpoints(endpoint,metodo,propiedad,columna,requerido,tipo) VALUES('endpoints','delete','endpoint','endpoint','S',1);
    END IF;
END;
$$;