<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0"
                xmlns:kiln="http://www.kcl.ac.uk/artshums/depts/ddh/kiln/ns/1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- XSLT to transform an EpiDoc index into HTML. Relies on common
       functionality in indices.xsl. -->

  <xsl:import href="indices.xsl" />

  <xsl:template name="render-instance-location">
    <!-- This field contains a single string with each location
         component separated by a "#". The components are (as taken
         from stylesheets/solr/epidoc-index-utils.xsl):

           * The content/xml subdirectory containing the indexed
           field, to be used in generating the map:match id used in
           generating the URL of the document containing this
           instance, via kiln:url-for-match. (This is the
           $subdirectory parameter.)

           * The path to the file (minus extension) this instance
           belongs to, relative to the content subdirectory (ie, the
           value in the preceding item), to be passed to the
           kiln:url-for-match call to generate the URL of the document
           containing this instance.

           * The text part numbers in descending hierarchical sequence
           for the instance, separated by ".".

           * The line number of the instance.

           * A Boolean marker (0 or 1) marking if the instance is
           partially or completely resotre (1) or not (0).

    -->
    <xsl:variable name="location_parts" select="tokenize(., '#')" />
    <xsl:variable name="match_id">
      <xsl:text>local-</xsl:text>
      <xsl:value-of select="$location_parts[1]" />
      <xsl:text>-display-html</xsl:text>
    </xsl:variable>
    <li>
      <a href="{kiln:url-for-match($match_id, ($language, $location_parts[2]), 0)}">
        <span class="index-instance-file">
           <xsl:value-of select="substring-after($location_parts[2], '_')" /> <!-- to exclude prefix 'lexicon/text/com/trag/cpch/hom' -->
        </span>
      </a>
    </li>
  </xsl:template>

</xsl:stylesheet>
